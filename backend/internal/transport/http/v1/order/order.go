package order

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/Alexander272/ring_orders/backend/internal/models/response"
	"github.com/Alexander272/ring_orders/backend/internal/services"
	"github.com/Alexander272/ring_orders/backend/internal/transport/http/middleware"
	"github.com/Alexander272/ring_orders/backend/pkg/error_bot"
	"github.com/Alexander272/ring_orders/backend/pkg/logger"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service services.Order
}

func NewHandler(service services.Order) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Order, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	order := api.Group("/orders")
	{
		order.GET("", handler.get)
		order.GET("/:id", handler.getById)
		order.GET("/important", handler.getImportant)
		order.POST("", handler.create)
		order.PUT("/:id", handler.update)
		order.DELETE("/:id", handler.delete)
	}
}

func (h *Handler) get(c *gin.Context) {
	params := &models.GetOrderDTO{
		Page:    &models.Page{},
		Sort:    []*models.Sort{},
		Filters: []*models.Filter{},
	}

	page := c.Query("page")
	size := c.Query("size")

	sortLine := c.Query("sort_by")
	filters := c.QueryMap("filters")

	limit, err := strconv.Atoi(size)
	if err != nil {
		params.Page.Limit = 15
	} else {
		params.Page.Limit = limit
	}

	p, err := strconv.Atoi(page)
	if err != nil {
		params.Page.Offset = 0
	} else {
		params.Page.Offset = (p - 1) * params.Page.Limit
	}

	if sortLine != "" {
		sort := strings.Split(sortLine, ",")
		for _, v := range sort {
			field, found := strings.CutPrefix(v, "-")
			t := "ASC"
			if found {
				t = "DESC"
			}

			params.Sort = append(params.Sort, &models.Sort{
				Field: field,
				Type:  t,
			})
		}
	}

	for k, v := range filters {
		valueMap := c.QueryMap(k)

		values := []*models.FilterValue{}
		for key, value := range valueMap {
			values = append(values, &models.FilterValue{
				CompareType: key,
				Value:       value,
			})
		}

		f := &models.Filter{
			Field:     k,
			FieldType: v,
			Values:    values,
		}

		params.Filters = append(params.Filters, f)
	}

	orders, err := h.service.Get(c, params)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), params)
		return
	}
	total := 0
	if len(orders) > 0 {
		total = orders[0].Total
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: orders, Total: total})
}

func (h *Handler) getById(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty id", "ID не указан")
		return
	}

	order, err := h.service.GetById(c, id)
	if err != nil {
		if errors.Is(err, models.ErrNoRows) {
			response.NewErrorResponse(c, http.StatusNotFound, err.Error(), "Запись не найдена")
			return
		}
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), id)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: order})
}

func (h *Handler) getImportant(c *gin.Context) {
	orders, err := h.service.GetImportant(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), nil)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: orders})
}

func (h *Handler) create(c *gin.Context) {
	dto := &models.CreateOrderDTO{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}

	logger.Info("Заказ создан",
		logger.StringAttr("section", "order"),
		logger.StringAttr("id", dto.Id),
		logger.StringAttr("number", dto.OrderNumber),
	)

	c.JSON(http.StatusCreated, response.IdResponse{Id: dto.Id, Message: "Успешно создано"})
}

func (h *Handler) update(c *gin.Context) {
	dto := &models.OrderDTO{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}

	logger.Info("Заказ обновлен",
		logger.StringAttr("section", "order"),
		logger.StringAttr("id", dto.Id),
		logger.StringAttr("number", dto.OrderNumber),
	)

	c.JSON(http.StatusOK, response.IdResponse{Message: "Успешно обновлено"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty id", "ID не указан")
		return
	}

	dto := &models.DeleteOrderDTO{Id: id}
	if err := h.service.Delete(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}

	logger.Info("Заказ удален",
		logger.StringAttr("section", "order"),
		logger.StringAttr("id", dto.Id),
	)

	c.Status(http.StatusNoContent)
}

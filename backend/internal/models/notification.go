package models

type Notification struct {
	Id       string   `json:"id" db:"id"`
	UserId   string   `json:"userId" db:"user_id"`
	Title    string   `json:"title" db:"title"`
	Text     string   `json:"text" db:"text"`
	Link     string   `json:"link" db:"link"`
	Date     int64    `json:"date" db:"date"`
	Priority Priority `json:"priority" db:"priority"`
}

type Priority int

const (
	Low    Priority = 3
	Medium Priority = 2
	High   Priority = 1
	Extra  Priority = 0
)

type GetNotificationsDTO struct {
	UserId string `json:"userId" db:"user_id"`
}

type NotificationDTO struct {
	Id       string   `json:"id" db:"id"`
	UserId   string   `json:"userId" db:"user_id"`
	Groups   []Group  `json:"group" db:"group"`
	Title    string   `json:"title" db:"title"`
	Text     string   `json:"text" db:"text"`
	Link     string   `json:"link" db:"link"`
	Date     int64    `json:"date" db:"date"`
	Priority Priority `json:"priority" db:"priority"`
}

type DeleteNotificationDTO struct {
	Id     string `json:"id" db:"id"`
	UserId string `json:"userId" db:"user_id"`
}

type Group string

const (
	UserGroup   Group = "/rings/user"
	EditorGroup Group = "/rings/editor"
)

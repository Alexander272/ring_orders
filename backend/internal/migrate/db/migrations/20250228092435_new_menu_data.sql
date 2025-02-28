-- +goose Up
-- +goose StatementBegin
INSERT INTO public.menu_item (id, name, method, description, is_show) VALUES
    ('335042e1-c0a5-4587-9b6b-5c16cc14eb22','sent','write','Отправленные позиции',true),
    ('bfea5bf3-35ff-46b5-b2b1-0b4f179259a3','sent','read','Отправленные позиции',true);

INSERT INTO public.menu (id, role_id, menu_item_id) VALUES
    ('67f9c8e8-5377-4e21-b602-ae88d509e33e', '145e7023-eb7b-42be-b4eb-e20fcd115ee3','bfea5bf3-35ff-46b5-b2b1-0b4f179259a3'), -- reader / sent | read
    ('c6bb3504-ff9f-4dbe-bdf6-9aeca9b41799', '25dbe10b-9a8b-418b-a655-2af9b35b8412','335042e1-c0a5-4587-9b6b-5c16cc14eb22'); -- user / sent | write

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM public.menu_item WHERE id IN ('335042e1-c0a5-4587-9b6b-5c16cc14eb22', 'bfea5bf3-35ff-46b5-b2b1-0b4f179259a3');
DELETE FROM public.menu WHERE id IN ('67f9c8e8-5377-4e21-b602-ae88d509e33e', 'c6bb3504-ff9f-4dbe-bdf6-9aeca9b41799');
-- +goose StatementEnd

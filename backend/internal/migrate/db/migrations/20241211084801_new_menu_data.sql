-- +goose Up
-- +goose StatementBegin
INSERT INTO public.roles (id, name, description, level, extends, is_show) VALUES
    ('145e7023-eb7b-42be-b4eb-e20fcd115ee3','reader','Читатель',1,'{}',true),
    ('25dbe10b-9a8b-418b-a655-2af9b35b8412','user','Пользователь',2,'{145e7023-eb7b-42be-b4eb-e20fcd115ee3}',true),
    ('05c5aa33-8744-46db-b3c3-6229ee6d2da3','editor','Редактор',6,'{145e7023-eb7b-42be-b4eb-e20fcd115ee3}',true),
    ('4b7a6cd0-f725-4033-a0e7-a65a028e84b6','admin','Администратор',9,'{145e7023-eb7b-42be-b4eb-e20fcd115ee3}',true),
    ('763d9afa-1952-40b7-8adc-1e7fe75627b9','root','',10,'{4b7a6cd0-f725-4033-a0e7-a65a028e84b6}',false);

INSERT INTO public.menu_item (id, name, method, description, is_show) VALUES
    ('e8a73be2-b785-4928-a2a3-1b1d22aad6ff','orders','write','Заказы',true),
    ('b51a91e4-25e7-4bac-9b62-2e7838f05cb5','orders','read','Заказы',true),
    ('bef6b5b7-9391-48d3-9512-b257d88d6844','positions','write','Позиции',true),
    ('78e3e1c0-baf4-4575-9338-6a18c32c7279','positions','read','Позиции',true),
    ('7c65b031-d76a-43cf-bfe3-8acb24174d4a','made','write','Изготовленные позиции',true),
    ('7f50d820-48b8-4527-8389-72b93abb6c6b','made','read','Изготовленные позиции',true),
    ('7e64d6b0-3463-4ce3-9c2a-73ed53278a3c','accept','write','Принятые позиции',true),
    ('3db734df-90b1-43b3-84cd-57235cf1dddc','accept','read','Принятые позиции',true);

INSERT INTO public.menu (id, role_id, menu_item_id) VALUES
    (gen_random_uuid(), '145e7023-eb7b-42be-b4eb-e20fcd115ee3','b51a91e4-25e7-4bac-9b62-2e7838f05cb5'), -- reader / orders | read
    (gen_random_uuid(), '145e7023-eb7b-42be-b4eb-e20fcd115ee3','78e3e1c0-baf4-4575-9338-6a18c32c7279'), -- reader / positions | read
    (gen_random_uuid(), '145e7023-eb7b-42be-b4eb-e20fcd115ee3','7f50d820-48b8-4527-8389-72b93abb6c6b'), -- reader / made | read
    (gen_random_uuid(), '145e7023-eb7b-42be-b4eb-e20fcd115ee3','3db734df-90b1-43b3-84cd-57235cf1dddc'), -- reader / accept | read
    (gen_random_uuid(), '25dbe10b-9a8b-418b-a655-2af9b35b8412','7c65b031-d76a-43cf-bfe3-8acb24174d4a'), -- user / made | write
    (gen_random_uuid(), '05c5aa33-8744-46db-b3c3-6229ee6d2da3','e8a73be2-b785-4928-a2a3-1b1d22aad6ff'), -- editor / orders | write
    (gen_random_uuid(), '05c5aa33-8744-46db-b3c3-6229ee6d2da3','bef6b5b7-9391-48d3-9512-b257d88d6844'), -- editor / positions | write
    (gen_random_uuid(), '05c5aa33-8744-46db-b3c3-6229ee6d2da3','7e64d6b0-3463-4ce3-9c2a-73ed53278a3c'); -- editor / accept | write

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
TRUNCATE public.menu, public.menu_item, public.roles;
-- +goose StatementEnd

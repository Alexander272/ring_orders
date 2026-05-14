-- +goose Up
-- +goose StatementBegin
INSERT INTO public.menu_item (id, name, method, description, is_show) VALUES
    ('86525f4b-e93d-4af3-b8dd-9f85fbb3be9a','reject','write','Бракованные позиции',true),
    ('c14a032f-ec1c-4925-be03-b01ffa382171','reject','read','Бракованные позиции',true);

INSERT INTO public.menu (id, role_id, menu_item_id) VALUES
    ('7f2a91a9-95f7-4673-b212-84a2afc953b2', '05c5aa33-8744-46db-b3c3-6229ee6d2da3','86525f4b-e93d-4af3-b8dd-9f85fbb3be9a'), -- editor / reject | write
    ('84aaed1d-9b55-4585-b19f-691cefb11e47', '145e7023-eb7b-42be-b4eb-e20fcd115ee3','c14a032f-ec1c-4925-be03-b01ffa382171'); -- reader / reject | read
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM public.menu_item WHERE id IN ('86525f4b-e93d-4af3-b8dd-9f85fbb3be9a', 'c14a032f-ec1c-4925-be03-b01ffa382171');
DELETE FROM public.menu WHERE id IN ('7f2a91a9-95f7-4673-b212-84a2afc953b2', '84aaed1d-9b55-4585-b19f-691cefb11e47');
-- +goose StatementEnd

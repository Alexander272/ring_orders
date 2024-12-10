-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.positions
(
    id uuid NOT NULL,
    order_id uuid NOT NULL,
    count integer NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    note text COLLATE pg_catalog."default" DEFAULT ''::text,
    amount integer NOT NULL,
    is_deleted boolean DEFAULT false,
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT positions_pkey PRIMARY KEY (id),
    CONSTRAINT positions_orders_id_fkey FOREIGN KEY (order_id)
        REFERENCES public.orders (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.positions
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.positions;
-- +goose StatementEnd

-- +goose Up
-- +goose StatementBegin
CREATE SEQUENCE IF NOT EXISTS public.orders_count_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;


CREATE TABLE IF NOT EXISTS public.orders
(
    id uuid NOT NULL,
    count integer NOT NULL DEFAULT nextval('orders_count_seq'::regclass),
    order_number text COLLATE pg_catalog."default" NOT NULL,
    notes text COLLATE pg_catalog."default" DEFAULT ''::text,
    date_of_issue integer NOT NULL,
    date_of_dispatch integer NOT NULL,
    date_of_adoption integer DEFAULT 0,
    closing_date integer DEFAULT 0,
    urgent boolean DEFAULT false,
    status text COLLATE pg_catalog."default" DEFAULT 'new'::text,
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT orders_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.orders
    OWNER to postgres;

ALTER SEQUENCE public.orders_count_seq
    OWNED BY public.orders.count;

ALTER SEQUENCE public.orders_count_seq
    OWNER TO postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.orders;

DROP SEQUENCE IF EXISTS public.orders_count_seq;
-- +goose StatementEnd

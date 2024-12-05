-- +goose Up
-- +goose StatementBegin
CREATE SEQUENCE IF NOT EXISTS public.positions_count_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

CREATE TABLE IF NOT EXISTS public.positions
(
    id uuid NOT NULL,
    order_id uuid NOT NULL,
    count integer NOT NULL DEFAULT nextval('positions_count_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    note text COLLATE pg_catalog."default" DEFAULT ''::text,
    amount integer NOT NULL,
    made integer DEFAULT 0,
    accepted integer DEFAULT 0,
    is_deleted boolean DEFAULT false,
    is_done boolean DEFAULT false,
    is_accept boolean DEFAULT false,
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

ALTER SEQUENCE public.positions_count_seq
    OWNED BY public.positions.count;

ALTER SEQUENCE public.positions_count_seq
    OWNER TO postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.positions;

DROP SEQUENCE IF EXISTS public.positions_count_seq;
-- +goose StatementEnd

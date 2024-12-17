-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.notifications
(
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    text text COLLATE pg_catalog."default" NOT NULL,
    link text COLLATE pg_catalog."default" DEFAULT ''::text,
    date integer NOT NULL,
    priority integer DEFAULT 2,
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notifications_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.notifications
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.notifications;
-- +goose StatementEnd

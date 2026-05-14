-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.rejects
(
    id uuid NOT NULL,
    position_id uuid NOT NULL,
    date integer NOT NULL,
    amount integer NOT NULL,
    note text COLLATE pg_catalog."default" DEFAULT ''::text,
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT rejects_pkey PRIMARY KEY (id),
    CONSTRAINT rejects_positions_id_fkey FOREIGN KEY (position_id)
        REFERENCES public.positions (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.rejects
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.rejects;
-- +goose StatementEnd

-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS public.made
(
    id uuid NOT NULL,
    position_id uuid NOT NULL,
    date integer NOT NULL,
    amount integer NOT NULL,
    note text COLLATE pg_catalog."default" DEFAULT ''::text,
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT made_pkey PRIMARY KEY (id),
    CONSTRAINT made_positions_id_fkey FOREIGN KEY (position_id)
        REFERENCES public.positions (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.made
    OWNER to postgres;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.made;
-- +goose StatementEnd

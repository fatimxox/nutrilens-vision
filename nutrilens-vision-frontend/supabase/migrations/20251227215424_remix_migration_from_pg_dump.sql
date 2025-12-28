CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: meal_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meal_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    meal_type text NOT NULL,
    name text,
    image_url text,
    calories integer DEFAULT 0,
    protein numeric DEFAULT 0,
    carbs numeric DEFAULT 0,
    fat numeric DEFAULT 0,
    fiber numeric DEFAULT 0,
    ingredients text[],
    logged_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    first_name text,
    last_name text,
    email text,
    avatar_url text,
    gender text,
    age integer,
    height numeric,
    weight numeric,
    activity_level text,
    goal text,
    allergies text[],
    medical_conditions text[],
    notifications_enabled boolean DEFAULT true,
    daily_water_goal integer DEFAULT 8,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: water_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.water_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    amount integer DEFAULT 1 NOT NULL,
    logged_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: meal_logs meal_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_logs
    ADD CONSTRAINT meal_logs_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: water_logs water_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.water_logs
    ADD CONSTRAINT water_logs_pkey PRIMARY KEY (id);


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: meal_logs Users can create their own meal logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own meal logs" ON public.meal_logs FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can create their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: water_logs Users can create their own water logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own water logs" ON public.water_logs FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: meal_logs Users can delete their own meal logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own meal logs" ON public.meal_logs FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: water_logs Users can delete their own water logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own water logs" ON public.water_logs FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: meal_logs Users can update their own meal logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own meal logs" ON public.meal_logs FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: meal_logs Users can view their own meal logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own meal logs" ON public.meal_logs FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: water_logs Users can view their own water logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own water logs" ON public.water_logs FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: meal_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: water_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;
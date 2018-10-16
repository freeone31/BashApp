--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.5
-- Dumped by pg_dump version 9.6.5

-- Started on 2017-10-23 22:51:49

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2145 (class 1262 OID 12401)
-- Dependencies: 2144
-- Name: postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- TOC entry 2 (class 3079 OID 12387)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2147 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- TOC entry 1 (class 3079 OID 16384)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 2148 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 189 (class 1259 OID 16408)
-- Name: dz_quote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE dz_quote (
    id integer NOT NULL,
    text text NOT NULL,
    datetime timestamp(3) without time zone DEFAULT ('now'::text)::date NOT NULL,
    userid integer NOT NULL
);


ALTER TABLE dz_quote OWNER TO postgres;

--
-- TOC entry 188 (class 1259 OID 16406)
-- Name: dz_quote_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE dz_quote_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE dz_quote_id_seq OWNER TO postgres;

--
-- TOC entry 2149 (class 0 OID 0)
-- Dependencies: 188
-- Name: dz_quote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE dz_quote_id_seq OWNED BY dz_quote.id;


--
-- TOC entry 186 (class 1259 OID 16393)
-- Name: dz_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE dz_user (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE dz_user OWNER TO postgres;

--
-- TOC entry 187 (class 1259 OID 16396)
-- Name: dz_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE dz_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE dz_user_id_seq OWNER TO postgres;

--
-- TOC entry 2150 (class 0 OID 0)
-- Dependencies: 187
-- Name: dz_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE dz_user_id_seq OWNED BY dz_user.id;


--
-- TOC entry 2010 (class 2604 OID 16411)
-- Name: dz_quote id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dz_quote ALTER COLUMN id SET DEFAULT nextval('dz_quote_id_seq'::regclass);


--
-- TOC entry 2009 (class 2604 OID 16398)
-- Name: dz_user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dz_user ALTER COLUMN id SET DEFAULT nextval('dz_user_id_seq'::regclass);


--
-- TOC entry 2139 (class 0 OID 16408)
-- Dependencies: 189
-- Data for Name: dz_quote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY dz_quote (id, text, datetime, userid) FROM stdin;
11	aaaaa	2017-10-22 14:34:12.427	62
10	bbbbb	2017-10-22 14:28:48.587	63
12	ccccc	2017-10-22 14:34:42.974	61
14	йцуйцуйцуйцу	2017-10-23 02:41:49.297	64
15	фывфывфывфыв	2017-10-23 02:43:02.121	65
16	ааааааааааа	2017-10-23 02:47:38.765	53
17	00000000000	2017-10-23 05:12:06.784	52
18	11111111111	2017-10-23 05:12:59.725	6
19	о май гад	2017-10-23 21:08:52.015	66
20	давай новую	2017-10-23 21:09:47.367	66
21	aaaaaaaawerta	2017-10-23 21:10:48.441	67
22	0001	2017-10-23 21:58:07.314	63
23	001	2017-10-23 21:58:36.169	68
24	000012	2017-10-23 22:01:17.52	69
\.


--
-- TOC entry 2151 (class 0 OID 0)
-- Dependencies: 188
-- Name: dz_quote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('dz_quote_id_seq', 24, true);


--
-- TOC entry 2136 (class 0 OID 16393)
-- Dependencies: 186
-- Data for Name: dz_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY dz_user (id, name) FROM stdin;
1	Вася
6	Коля
51	Артур
52	Борис
53	Глеб
54	Мансур
55	Кирилл
56	Булат
57	Алексей
58	Роберт
59	Женя
60	Максим
61	Салават
62	Сергей
63	Олег
64	Николай
65	Михаил
66	Настя
67	Гектор
68	Джамш
69	Breakky
\.


--
-- TOC entry 2152 (class 0 OID 0)
-- Dependencies: 187
-- Name: dz_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('dz_user_id_seq', 69, true);


--
-- TOC entry 2017 (class 2606 OID 16413)
-- Name: dz_quote dz_quote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dz_quote
    ADD CONSTRAINT dz_quote_pkey PRIMARY KEY (id);


--
-- TOC entry 2013 (class 2606 OID 16405)
-- Name: dz_user dz_user_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dz_user
    ADD CONSTRAINT dz_user_name_unique UNIQUE (name);


--
-- TOC entry 2015 (class 2606 OID 16403)
-- Name: dz_user dz_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dz_user
    ADD CONSTRAINT dz_user_pkey PRIMARY KEY (id);


--
-- TOC entry 2018 (class 2606 OID 16417)
-- Name: dz_quote dz_quote_userid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dz_quote
    ADD CONSTRAINT dz_quote_userid FOREIGN KEY (userid) REFERENCES dz_user(id);


-- Completed on 2017-10-23 22:51:49

--
-- PostgreSQL database dump complete
--


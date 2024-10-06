create table "public"."blog_posts" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "title" text not null,
    "content" text,
    "published_at" timestamp with time zone,
    "image_url" text
);


alter table "public"."blog_posts" enable row level security;

create table "public"."feeding_records" (
    "id" uuid not null default uuid_generate_v4(),
    "fish_id" uuid,
    "date" date,
    "amount" numeric,
    "food_type" text
);


alter table "public"."feeding_records" enable row level security;

create table "public"."growth_records" (
    "id" uuid not null default uuid_generate_v4(),
    "fish_id" uuid,
    "date" date,
    "size" numeric,
    "weight" numeric,
    "notes" text
);


alter table "public"."growth_records" enable row level security;

create table "public"."koi_fish" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "pond_id" uuid,
    "name" text,
    "image_url" text,
    "body_shape" text,
    "age" integer,
    "size" numeric,
    "weight" numeric,
    "gender" text,
    "breed" text,
    "origin" text,
    "price" numeric,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."koi_fish" enable row level security;

create table "public"."order_items" (
    "id" uuid not null default uuid_generate_v4(),
    "order_id" uuid,
    "product_id" uuid,
    "quantity" integer,
    "price" numeric
);


alter table "public"."order_items" enable row level security;

create table "public"."orders" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "order_date" timestamp with time zone default CURRENT_TIMESTAMP,
    "total_amount" numeric,
    "status" text
);


alter table "public"."orders" enable row level security;

create table "public"."ponds" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "name" text not null,
    "image_url" text,
    "size" numeric,
    "depth" numeric,
    "volume" numeric,
    "drain_count" integer,
    "pump_capacity" numeric,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."ponds" enable row level security;

create table "public"."products" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text,
    "price" numeric,
    "category" text,
    "image_url" text
);


alter table "public"."products" enable row level security;

create table "public"."users" (
    "id" uuid not null,
    "updated_at" timestamp with time zone,
    "username" text,
    "full_name" text,
    "avatar_url" text
);


alter table "public"."users" enable row level security;

create table "public"."water_parameters" (
    "id" uuid not null default uuid_generate_v4(),
    "pond_id" uuid,
    "measured_at" timestamp with time zone,
    "temperature" numeric,
    "salinity" numeric,
    "ph" numeric,
    "oxygen" numeric,
    "nitrite" numeric,
    "nitrate" numeric,
    "phosphate" numeric
);


alter table "public"."water_parameters" enable row level security;

CREATE UNIQUE INDEX blog_posts_pkey ON public.blog_posts USING btree (id);

CREATE UNIQUE INDEX feeding_records_pkey ON public.feeding_records USING btree (id);

CREATE UNIQUE INDEX growth_records_pkey ON public.growth_records USING btree (id);

CREATE UNIQUE INDEX koi_fish_pkey ON public.koi_fish USING btree (id);

CREATE UNIQUE INDEX order_items_pkey ON public.order_items USING btree (id);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE UNIQUE INDEX ponds_pkey ON public.ponds USING btree (id);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

CREATE UNIQUE INDEX water_parameters_pkey ON public.water_parameters USING btree (id);

alter table "public"."blog_posts" add constraint "blog_posts_pkey" PRIMARY KEY using index "blog_posts_pkey";

alter table "public"."feeding_records" add constraint "feeding_records_pkey" PRIMARY KEY using index "feeding_records_pkey";

alter table "public"."growth_records" add constraint "growth_records_pkey" PRIMARY KEY using index "growth_records_pkey";

alter table "public"."koi_fish" add constraint "koi_fish_pkey" PRIMARY KEY using index "koi_fish_pkey";

alter table "public"."order_items" add constraint "order_items_pkey" PRIMARY KEY using index "order_items_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."ponds" add constraint "ponds_pkey" PRIMARY KEY using index "ponds_pkey";

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."water_parameters" add constraint "water_parameters_pkey" PRIMARY KEY using index "water_parameters_pkey";

alter table "public"."blog_posts" add constraint "blog_posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."blog_posts" validate constraint "blog_posts_user_id_fkey";

alter table "public"."feeding_records" add constraint "feeding_records_fish_id_fkey" FOREIGN KEY (fish_id) REFERENCES koi_fish(id) not valid;

alter table "public"."feeding_records" validate constraint "feeding_records_fish_id_fkey";

alter table "public"."growth_records" add constraint "growth_records_fish_id_fkey" FOREIGN KEY (fish_id) REFERENCES koi_fish(id) not valid;

alter table "public"."growth_records" validate constraint "growth_records_fish_id_fkey";

alter table "public"."koi_fish" add constraint "koi_fish_pond_id_fkey" FOREIGN KEY (pond_id) REFERENCES ponds(id) not valid;

alter table "public"."koi_fish" validate constraint "koi_fish_pond_id_fkey";

alter table "public"."koi_fish" add constraint "koi_fish_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."koi_fish" validate constraint "koi_fish_user_id_fkey";

alter table "public"."order_items" add constraint "order_items_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) not valid;

alter table "public"."order_items" validate constraint "order_items_order_id_fkey";

alter table "public"."order_items" add constraint "order_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) not valid;

alter table "public"."order_items" validate constraint "order_items_product_id_fkey";

alter table "public"."orders" add constraint "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."orders" validate constraint "orders_user_id_fkey";

alter table "public"."ponds" add constraint "ponds_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."ponds" validate constraint "ponds_user_id_fkey";

alter table "public"."users" add constraint "username_length" CHECK ((char_length(username) >= 3)) not valid;

alter table "public"."users" validate constraint "username_length";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."users" add constraint "users_username_key" UNIQUE using index "users_username_key";

alter table "public"."water_parameters" add constraint "water_parameters_pond_id_fkey" FOREIGN KEY (pond_id) REFERENCES ponds(id) not valid;

alter table "public"."water_parameters" validate constraint "water_parameters_pond_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name', 
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."blog_posts" to "anon";

grant insert on table "public"."blog_posts" to "anon";

grant references on table "public"."blog_posts" to "anon";

grant select on table "public"."blog_posts" to "anon";

grant trigger on table "public"."blog_posts" to "anon";

grant truncate on table "public"."blog_posts" to "anon";

grant update on table "public"."blog_posts" to "anon";

grant delete on table "public"."blog_posts" to "authenticated";

grant insert on table "public"."blog_posts" to "authenticated";

grant references on table "public"."blog_posts" to "authenticated";

grant select on table "public"."blog_posts" to "authenticated";

grant trigger on table "public"."blog_posts" to "authenticated";

grant truncate on table "public"."blog_posts" to "authenticated";

grant update on table "public"."blog_posts" to "authenticated";

grant delete on table "public"."blog_posts" to "service_role";

grant insert on table "public"."blog_posts" to "service_role";

grant references on table "public"."blog_posts" to "service_role";

grant select on table "public"."blog_posts" to "service_role";

grant trigger on table "public"."blog_posts" to "service_role";

grant truncate on table "public"."blog_posts" to "service_role";

grant update on table "public"."blog_posts" to "service_role";

grant delete on table "public"."feeding_records" to "anon";

grant insert on table "public"."feeding_records" to "anon";

grant references on table "public"."feeding_records" to "anon";

grant select on table "public"."feeding_records" to "anon";

grant trigger on table "public"."feeding_records" to "anon";

grant truncate on table "public"."feeding_records" to "anon";

grant update on table "public"."feeding_records" to "anon";

grant delete on table "public"."feeding_records" to "authenticated";

grant insert on table "public"."feeding_records" to "authenticated";

grant references on table "public"."feeding_records" to "authenticated";

grant select on table "public"."feeding_records" to "authenticated";

grant trigger on table "public"."feeding_records" to "authenticated";

grant truncate on table "public"."feeding_records" to "authenticated";

grant update on table "public"."feeding_records" to "authenticated";

grant delete on table "public"."feeding_records" to "service_role";

grant insert on table "public"."feeding_records" to "service_role";

grant references on table "public"."feeding_records" to "service_role";

grant select on table "public"."feeding_records" to "service_role";

grant trigger on table "public"."feeding_records" to "service_role";

grant truncate on table "public"."feeding_records" to "service_role";

grant update on table "public"."feeding_records" to "service_role";

grant delete on table "public"."growth_records" to "anon";

grant insert on table "public"."growth_records" to "anon";

grant references on table "public"."growth_records" to "anon";

grant select on table "public"."growth_records" to "anon";

grant trigger on table "public"."growth_records" to "anon";

grant truncate on table "public"."growth_records" to "anon";

grant update on table "public"."growth_records" to "anon";

grant delete on table "public"."growth_records" to "authenticated";

grant insert on table "public"."growth_records" to "authenticated";

grant references on table "public"."growth_records" to "authenticated";

grant select on table "public"."growth_records" to "authenticated";

grant trigger on table "public"."growth_records" to "authenticated";

grant truncate on table "public"."growth_records" to "authenticated";

grant update on table "public"."growth_records" to "authenticated";

grant delete on table "public"."growth_records" to "service_role";

grant insert on table "public"."growth_records" to "service_role";

grant references on table "public"."growth_records" to "service_role";

grant select on table "public"."growth_records" to "service_role";

grant trigger on table "public"."growth_records" to "service_role";

grant truncate on table "public"."growth_records" to "service_role";

grant update on table "public"."growth_records" to "service_role";

grant delete on table "public"."koi_fish" to "anon";

grant insert on table "public"."koi_fish" to "anon";

grant references on table "public"."koi_fish" to "anon";

grant select on table "public"."koi_fish" to "anon";

grant trigger on table "public"."koi_fish" to "anon";

grant truncate on table "public"."koi_fish" to "anon";

grant update on table "public"."koi_fish" to "anon";

grant delete on table "public"."koi_fish" to "authenticated";

grant insert on table "public"."koi_fish" to "authenticated";

grant references on table "public"."koi_fish" to "authenticated";

grant select on table "public"."koi_fish" to "authenticated";

grant trigger on table "public"."koi_fish" to "authenticated";

grant truncate on table "public"."koi_fish" to "authenticated";

grant update on table "public"."koi_fish" to "authenticated";

grant delete on table "public"."koi_fish" to "service_role";

grant insert on table "public"."koi_fish" to "service_role";

grant references on table "public"."koi_fish" to "service_role";

grant select on table "public"."koi_fish" to "service_role";

grant trigger on table "public"."koi_fish" to "service_role";

grant truncate on table "public"."koi_fish" to "service_role";

grant update on table "public"."koi_fish" to "service_role";

grant delete on table "public"."order_items" to "anon";

grant insert on table "public"."order_items" to "anon";

grant references on table "public"."order_items" to "anon";

grant select on table "public"."order_items" to "anon";

grant trigger on table "public"."order_items" to "anon";

grant truncate on table "public"."order_items" to "anon";

grant update on table "public"."order_items" to "anon";

grant delete on table "public"."order_items" to "authenticated";

grant insert on table "public"."order_items" to "authenticated";

grant references on table "public"."order_items" to "authenticated";

grant select on table "public"."order_items" to "authenticated";

grant trigger on table "public"."order_items" to "authenticated";

grant truncate on table "public"."order_items" to "authenticated";

grant update on table "public"."order_items" to "authenticated";

grant delete on table "public"."order_items" to "service_role";

grant insert on table "public"."order_items" to "service_role";

grant references on table "public"."order_items" to "service_role";

grant select on table "public"."order_items" to "service_role";

grant trigger on table "public"."order_items" to "service_role";

grant truncate on table "public"."order_items" to "service_role";

grant update on table "public"."order_items" to "service_role";

grant delete on table "public"."orders" to "anon";

grant insert on table "public"."orders" to "anon";

grant references on table "public"."orders" to "anon";

grant select on table "public"."orders" to "anon";

grant trigger on table "public"."orders" to "anon";

grant truncate on table "public"."orders" to "anon";

grant update on table "public"."orders" to "anon";

grant delete on table "public"."orders" to "authenticated";

grant insert on table "public"."orders" to "authenticated";

grant references on table "public"."orders" to "authenticated";

grant select on table "public"."orders" to "authenticated";

grant trigger on table "public"."orders" to "authenticated";

grant truncate on table "public"."orders" to "authenticated";

grant update on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant references on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant trigger on table "public"."orders" to "service_role";

grant truncate on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

grant delete on table "public"."ponds" to "anon";

grant insert on table "public"."ponds" to "anon";

grant references on table "public"."ponds" to "anon";

grant select on table "public"."ponds" to "anon";

grant trigger on table "public"."ponds" to "anon";

grant truncate on table "public"."ponds" to "anon";

grant update on table "public"."ponds" to "anon";

grant delete on table "public"."ponds" to "authenticated";

grant insert on table "public"."ponds" to "authenticated";

grant references on table "public"."ponds" to "authenticated";

grant select on table "public"."ponds" to "authenticated";

grant trigger on table "public"."ponds" to "authenticated";

grant truncate on table "public"."ponds" to "authenticated";

grant update on table "public"."ponds" to "authenticated";

grant delete on table "public"."ponds" to "service_role";

grant insert on table "public"."ponds" to "service_role";

grant references on table "public"."ponds" to "service_role";

grant select on table "public"."ponds" to "service_role";

grant trigger on table "public"."ponds" to "service_role";

grant truncate on table "public"."ponds" to "service_role";

grant update on table "public"."ponds" to "service_role";

grant delete on table "public"."products" to "anon";

grant insert on table "public"."products" to "anon";

grant references on table "public"."products" to "anon";

grant select on table "public"."products" to "anon";

grant trigger on table "public"."products" to "anon";

grant truncate on table "public"."products" to "anon";

grant update on table "public"."products" to "anon";

grant delete on table "public"."products" to "authenticated";

grant insert on table "public"."products" to "authenticated";

grant references on table "public"."products" to "authenticated";

grant select on table "public"."products" to "authenticated";

grant trigger on table "public"."products" to "authenticated";

grant truncate on table "public"."products" to "authenticated";

grant update on table "public"."products" to "authenticated";

grant delete on table "public"."products" to "service_role";

grant insert on table "public"."products" to "service_role";

grant references on table "public"."products" to "service_role";

grant select on table "public"."products" to "service_role";

grant trigger on table "public"."products" to "service_role";

grant truncate on table "public"."products" to "service_role";

grant update on table "public"."products" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

grant delete on table "public"."water_parameters" to "anon";

grant insert on table "public"."water_parameters" to "anon";

grant references on table "public"."water_parameters" to "anon";

grant select on table "public"."water_parameters" to "anon";

grant trigger on table "public"."water_parameters" to "anon";

grant truncate on table "public"."water_parameters" to "anon";

grant update on table "public"."water_parameters" to "anon";

grant delete on table "public"."water_parameters" to "authenticated";

grant insert on table "public"."water_parameters" to "authenticated";

grant references on table "public"."water_parameters" to "authenticated";

grant select on table "public"."water_parameters" to "authenticated";

grant trigger on table "public"."water_parameters" to "authenticated";

grant truncate on table "public"."water_parameters" to "authenticated";

grant update on table "public"."water_parameters" to "authenticated";

grant delete on table "public"."water_parameters" to "service_role";

grant insert on table "public"."water_parameters" to "service_role";

grant references on table "public"."water_parameters" to "service_role";

grant select on table "public"."water_parameters" to "service_role";

grant trigger on table "public"."water_parameters" to "service_role";

grant truncate on table "public"."water_parameters" to "service_role";

grant update on table "public"."water_parameters" to "service_role";

create policy "All users can view blog posts"
on "public"."blog_posts"
as permissive
for select
to public
using (true);


create policy "Users can create their own blog posts"
on "public"."blog_posts"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can delete their own blog posts"
on "public"."blog_posts"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can update their own blog posts"
on "public"."blog_posts"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can create feeding records for their fish"
on "public"."feeding_records"
as permissive
for insert
to public
with check ((auth.uid() = ( SELECT koi_fish.user_id
   FROM koi_fish
  WHERE (koi_fish.id = feeding_records.fish_id))));


create policy "Users can delete feeding records of their fish"
on "public"."feeding_records"
as permissive
for delete
to public
using ((auth.uid() = ( SELECT koi_fish.user_id
   FROM koi_fish
  WHERE (koi_fish.id = feeding_records.fish_id))));


create policy "Users can update feeding records of their fish"
on "public"."feeding_records"
as permissive
for update
to public
using ((auth.uid() = ( SELECT koi_fish.user_id
   FROM koi_fish
  WHERE (koi_fish.id = feeding_records.fish_id))));


create policy "Users can view feeding records of their fish"
on "public"."feeding_records"
as permissive
for select
to public
using ((auth.uid() = ( SELECT koi_fish.user_id
   FROM koi_fish
  WHERE (koi_fish.id = feeding_records.fish_id))));


create policy "Users can create growth records for their fish"
on "public"."growth_records"
as permissive
for insert
to public
with check ((auth.uid() = ( SELECT koi_fish.user_id
   FROM koi_fish
  WHERE (koi_fish.id = growth_records.fish_id))));


create policy "Users can delete growth records of their fish"
on "public"."growth_records"
as permissive
for delete
to public
using ((auth.uid() = ( SELECT koi_fish.user_id
   FROM koi_fish
  WHERE (koi_fish.id = growth_records.fish_id))));


create policy "Users can update growth records of their fish"
on "public"."growth_records"
as permissive
for update
to public
using ((auth.uid() = ( SELECT koi_fish.user_id
   FROM koi_fish
  WHERE (koi_fish.id = growth_records.fish_id))));


create policy "Users can view growth records of their fish"
on "public"."growth_records"
as permissive
for select
to public
using ((auth.uid() = ( SELECT koi_fish.user_id
   FROM koi_fish
  WHERE (koi_fish.id = growth_records.fish_id))));


create policy "Users can create their own koi fish"
on "public"."koi_fish"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can delete their own koi fish"
on "public"."koi_fish"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can update their own koi fish"
on "public"."koi_fish"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own koi fish"
on "public"."koi_fish"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can create their own order items"
on "public"."order_items"
as permissive
for insert
to public
with check ((auth.uid() = ( SELECT orders.user_id
   FROM orders
  WHERE (orders.id = order_items.order_id))));


create policy "Users can update their own order items"
on "public"."order_items"
as permissive
for update
to public
using ((auth.uid() = ( SELECT orders.user_id
   FROM orders
  WHERE (orders.id = order_items.order_id))));


create policy "Users can view their own order items"
on "public"."order_items"
as permissive
for select
to public
using ((auth.uid() = ( SELECT orders.user_id
   FROM orders
  WHERE (orders.id = order_items.order_id))));


create policy "Users can create their own orders"
on "public"."orders"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their own orders"
on "public"."orders"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own orders"
on "public"."orders"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can create their own ponds"
on "public"."ponds"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can delete their own ponds"
on "public"."ponds"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can update their own ponds"
on "public"."ponds"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own ponds"
on "public"."ponds"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "All users can view products"
on "public"."products"
as permissive
for select
to public
using (true);


create policy "Users can update their own profile"
on "public"."users"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can view their own profile"
on "public"."users"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "Users can create water parameters for their ponds"
on "public"."water_parameters"
as permissive
for insert
to public
with check ((auth.uid() = ( SELECT ponds.user_id
   FROM ponds
  WHERE (ponds.id = water_parameters.pond_id))));


create policy "Users can delete water parameters of their ponds"
on "public"."water_parameters"
as permissive
for delete
to public
using ((auth.uid() = ( SELECT ponds.user_id
   FROM ponds
  WHERE (ponds.id = water_parameters.pond_id))));


create policy "Users can update water parameters of their ponds"
on "public"."water_parameters"
as permissive
for update
to public
using ((auth.uid() = ( SELECT ponds.user_id
   FROM ponds
  WHERE (ponds.id = water_parameters.pond_id))));


create policy "Users can view water parameters of their ponds"
on "public"."water_parameters"
as permissive
for select
to public
using ((auth.uid() = ( SELECT ponds.user_id
   FROM ponds
  WHERE (ponds.id = water_parameters.pond_id))));




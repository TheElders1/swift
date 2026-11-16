-- Run this in Supabase SQL Editor to expose public parcel, route, and contact
-- details to valid tracking numbers. Shipments in Trash are excluded.
create or replace function public.track_shipment(p_tracking_number text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'tracking_number', s.tracking_number,
    'status', s.status,
    'sender_name', s.sender_name,
    'sender_address', s.sender_address,
    'sender_email', s.sender_email,
    'sender_phone', s.sender_phone,
    'receiver_name', s.receiver_name,
    'receiver_address', s.receiver_address,
    'receiver_email', s.receiver_email,
    'receiver_phone', s.receiver_phone,
    'origin', s.origin,
    'destination', s.destination,
    'description', s.description,
    'package_type', s.package_type,
    'package_image_url', s.package_image_url,
    'weight_kg', s.weight_kg,
    'shipment_amount', s.shipment_amount,
    'currency', coalesce(s.currency, s.shipment_currency, 'USD'),
    'shipment_date', s.shipment_date,
    'estimated_delivery', s.estimated_delivery,
    'current_lat', s.current_lat,
    'current_lng', s.current_lng,
    'origin_lat', s.origin_lat,
    'origin_lng', s.origin_lng,
    'destination_lat', s.destination_lat,
    'destination_lng', s.destination_lng,
    'progress_percent', coalesce((
      select h.progress_percent from public.tracking_history h
      where h.shipment_id = s.id
      order by h.created_at desc limit 1
    ), 0),
    'history', coalesce((
      select jsonb_agg(jsonb_build_object(
        'status', h.status,
        'location', h.location,
        'lat', h.lat,
        'lng', h.lng,
        'note', h.note,
        'progress_percent', h.progress_percent,
        'created_at', h.created_at
      ) order by h.created_at desc)
      from public.tracking_history h where h.shipment_id = s.id
    ), '[]'::jsonb)
  )
  from public.shipments s
  where lower(s.tracking_number) = lower(trim(p_tracking_number))
    and s.deleted_at is null
  limit 1;
$$;

revoke all on function public.track_shipment(text) from public;
grant execute on function public.track_shipment(text) to anon, authenticated;

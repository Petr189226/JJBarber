alter table voucher_orders drop constraint if exists voucher_orders_status_check;
alter table voucher_orders add constraint voucher_orders_status_check
  check (status in ('new', 'pending', 'done', 'awaiting_payment', 'storno'));

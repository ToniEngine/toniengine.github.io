/* Supabase connection details.
 *
 * Multiplayer rooms run over Supabase Realtime. Fill these two values in from
 * your project's Settings -> API page, or leave them empty and set them from
 * the browser console on any device:
 *
 *   Net.setServer('https://YOUR-PROJECT.supabase.co', 'YOUR-ANON-KEY')
 *
 * The anon key is designed to be public - it ships inside browser apps by
 * design. This app uses Realtime Broadcast only: no database tables, no stored
 * user data, nothing behind the key to protect. Rotate it in the dashboard if
 * you ever want to cut off existing clients.
 *
 * Solo practice needs none of this and works with these left blank.
 */
window.TENERGY_SUPABASE = {
  url: '',
  anonKey: ''
};

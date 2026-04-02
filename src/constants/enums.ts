export enum Routes {
  ROOT = "/",
  OWNER = "/owner",
  LISTBOOKINGS = "/owner/list-bookings",
  LISTROOMS = "/owner/list-rooms",
  ADDROOM = "/owner/add-room",
}

export enum Pages {
  ROOMS = "/rooms",
  ABOUT = "/about",
  CONTACT = "/contact",
  MYBOOKINGS = "/my-bookings",
}

export const ROOMS_PER_PAGE = 5;
export const BOOKINGS_PER_PAGE = 5;

const PRODUCTION_DOMAIN = "https://hotels-booking-chi.vercel.app";

const DEVELOPMENT_DOMAIN = "http://localhost:3000";

export const DOMAIN =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_DOMAIN
    : DEVELOPMENT_DOMAIN;

// without defined matcher, applies next-auth 
// to entire site
export { default } from "next-auth/middleware";

// applies next-auth only to matching routes - can be regex
// const routes = ["/placeholder"];
// export const config = { matcher: routes }
use std::time::Instant;

use actix::*;
use actix_web::{web, App, Error, HttpRequest, HttpResponse, HttpServer, Responder};
use actix_web_actors::ws;
use uuid::Uuid;

mod server;
mod session;

async fn index() -> impl Responder {
    HttpResponse::Ok().body("v0.1.0")
}

/// Entry point for our websocket route
async fn ws_route(
    req: HttpRequest,
    stream: web::Payload,
    srv: web::Data<Addr<server::WSServer>>,
) -> Result<HttpResponse, Error> {
    ws::start(
        session::WSSession {
            id: Uuid::new_v4(),
            hb: Instant::now(),
            room: "main".to_owned(),
            name: None,
            addr: srv.get_ref().clone(),
        },
        &req,
        stream,
    )
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // start chat server actor
    let server = server::WSServer::new().start();

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(server.clone()))
            .service(web::resource("/").to(index))
            .route("/ws", web::get().to(ws_route))
    })
    .workers(2)
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

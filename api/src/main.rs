use actix_files::Files;
use actix_web::{middleware::Logger, post, web, App, HttpServer};
use env_logger::Env;
pub mod configuration;
pub mod shift;
use chrono::{Datelike, Duration, DateTime, Utc};
use configuration::{Configuration, Person};
use rand::{seq::SliceRandom, thread_rng};
use shift::Shift;
use std::{ops::Add, error::Error, fmt};

fn check_repeated_sundays(shifts: &Vec<Shift>, new_shift: &Shift) -> bool {
    if new_shift.date.weekday() != chrono::Weekday::Sun {
        return false;
    }
    let previous_sundays = shifts
        .iter()
        .filter(|x|
            x.date.weekday() == chrono::Weekday::Sun
                && x.id_person == new_shift.id_person
                && (new_shift.date - x.date).num_days() <= 23
        )
        .count();

    return previous_sundays >= 2;
}

fn shifts_distance(number_of_shifts: i32, a: &Shift, b: &Shift) -> i32 {
    let days = (b.date - a.date).num_days() as i32;
    if days == 0 {
        return b.shift - a.shift;
    }
    let shifts_first_day = number_of_shifts - a.shift - 1;
    let shifts_inbetween_days = (days - 1) * number_of_shifts;
    return shifts_first_day + shifts_inbetween_days + b.shift;
}

fn check_minimum_pause_between_shifts(
    number_of_shifts: i32,
    shifts: &Vec<Shift>,
    new_shift: &Shift,
) -> bool {
    let filtered = shifts
        .iter()
        .filter(|x| x.id_person == new_shift.id_person)
        .last();
    match filtered {
        None => false,
        Some(f) => shifts_distance(number_of_shifts, f, new_shift) < 2,
    }
}

fn check_rules(number_of_shifts: i32, shifts: &Vec<Shift>, new_shift: &Shift) -> bool {
    return check_minimum_pause_between_shifts(number_of_shifts, shifts, new_shift)
        || check_repeated_sundays(shifts, new_shift);
}

fn next_shift(config: &Configuration, previous_shifts: &Vec<Shift>, person: &Person) -> Shift {
    match previous_shifts.last() {
        None => Shift {
            date: config.parameters.startingDate,
            shift: 0,
            id_person: person.id.clone()
        },
        Some(last) => if last.shift >= config.parameters.numberOfShifts {
            return Shift {
                date: last.date.add(Duration::days(1)),
                shift: 0,
                id_person: person.id.clone()
            }
        } else {
            return Shift {
                date: last.date,
                shift: last.shift + 1,
                id_person: person.id.clone()
            }
        }
    }
}

pub(crate) struct NotFoundError;

impl fmt::Display for NotFoundError {
    fn fmt(&self, f: &mut fmt::Formatter) -> Result<(), std::fmt::Error> {
        write!(f, "Error")
    }
}

// A unique format for dubugging output
impl fmt::Debug for NotFoundError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Error")
    }
}

impl Error for NotFoundError {

}

fn recursive_answer(started_time : DateTime<Utc>, config: &Configuration, previous_shifts: &Vec<Shift>) -> Result<Vec<Shift>, Box<dyn Error>> {
    
    if (chrono::Utc::now() - started_time).num_milliseconds() > 300 {
        return Err(Box::new(NotFoundError{}));
    }
    
    let mut people = config.people.to_vec();
    let mut rng = thread_rng();
    people.shuffle(&mut rng);
    for person in config.people.iter() {
        let next = next_shift(config, previous_shifts, person);
        if !check_rules(config.parameters.numberOfShifts, previous_shifts, &next) {
            let mut shifts: Vec<Shift> = previous_shifts.to_vec();
            shifts.push(next);
            if shifts.len() as i32 >= config.parameters.numberOfDays * config.parameters.numberOfShifts {
                return Ok(shifts);
            }
            let attempt = recursive_answer(started_time, config, &shifts);
            if attempt.is_ok() {
                return attempt;
            }
        }
    }
    return Err(Box::new(NotFoundError{}) as Box<dyn Error>);
}

fn recursive(config: &Configuration) -> Result<Vec<Shift>, Box<dyn Error>> {
    let empty = Vec::<Shift>::new();
    return recursive_answer(Utc::now(), config, &empty);
}

#[post("/solve")]
async fn solve(config: web::Json<Configuration>) -> Result<web::Json<Vec<Shift>>, ()> {
    let answer = recursive(&config.0).map_err(|_e| ())?;
    return Ok(web::Json(answer));
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "actix_web=trace");
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    HttpServer::new(|| {

        App::new()
            .wrap(Logger::default())
            .service(solve)
            .service(Files::new("/", "./dist").prefer_utf8(true))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}

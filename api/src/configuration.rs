

use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use std::rc::Rc;

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct Parameters {
    pub startingDate: DateTime<Utc>,
    pub numberOfDays: i32,
    pub numberOfShifts: i32,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Person {
    pub id: Rc<String>,
    pub name: String,
}

#[derive(Serialize, Deserialize)]
pub struct Configuration {
    pub people: Vec<Person>,
    pub parameters: Parameters,
}
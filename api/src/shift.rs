use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use std::rc::Rc;

#[derive(Serialize, Deserialize, Clone)]
pub struct Shift {
    pub date: DateTime<Utc>,
    pub shift: i32,
    pub id_person: Rc<String>,
}

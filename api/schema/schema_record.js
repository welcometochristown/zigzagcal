const schema = {
    "name": "string",
    "datesk" : "number",
    "breakdown": {
        "0": {
            "value":"number",
            "complete":"boolean"
        },
        "1": {
            "value":"number",
            "complete":"boolean"
        },
        "2": {
            "value":"number",
            "complete":"boolean"
        },
        "3":{
            "value":"number",
            "complete":"boolean"
        },
        "4": {
            "value":"number",
            "complete":"boolean"
        },
        "5": {
            "value":"number",
            "complete":"boolean"
        },
        "6": {
            "value":"number",
            "complete":"boolean"
        },
    },
    "weekly": {
        "monday": "number",
        "tuesday": "number",
        "wednesday": "number",
        "thursday": "number",
        "friday": "number",
        "saturday": "number",
        "sunday": "number",
    },

}

module.exports = schema;
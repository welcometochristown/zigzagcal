export class database  {

    static async load(user, datesk, last = false) {

        if(!user || !datesk)
            return;

        const url = 'http://' + window.location.hostname + ':1337/'+ (last ? 'last' : '') + user + '/' + datesk;

        let data = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())

        if(data.length > 0)
            return data[0];

        return;
    }

    static async save(obj) {
        const url = 'http://' + window.location.hostname + ':1337';
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(this.state.record)
        });
    }
}
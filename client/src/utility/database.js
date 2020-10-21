export class database  {

    static async dbFetch(url, action, headers, body)
    {
        console.log({
            url:url,
            action:action,
            headers:headers,
            body:body
        });

        return await fetch(url, {
            method: action,
            headers
        });
    }

    static async load(user, datesk, last = false) {

        if(!user || !datesk)
            return;
            
        const url = 'http://' + window.location.hostname + ':1337/'+ (last ? 'last/' : '') + user + '/' + datesk;

        let data = await database.dbFetch(url, 'GET', {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
        })
        .then(res => res.json())

        if(data.length > 0)
            return data[0];

        return;
    }

    static async save(obj) {
        const url = 'http://' + window.location.hostname + ':1337';

        await database.dbFetch(url, 'POST', {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            JSON.stringify(this.state.record)
        );
    }
}
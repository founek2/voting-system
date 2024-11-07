import { EventEmitter } from "events"

const storage = localStorage
const TOKEN_KEY = 'accessToken'

export interface AccessToken {
    scope: string
    expires: number
    accessToken: string
}

class InternalStorage extends EventEmitter {

    public setAccessToken(token: AccessToken) {
        this.emit('accessToken', token)
        storage.setItem(TOKEN_KEY, JSON.stringify(token))
    }

    public getAccessToken(): AccessToken | undefined {
        const token = storage.getItem(TOKEN_KEY)
        if (!token) return

        return JSON.parse(token)
    }

    public deleteAccessToken() {
        storage.removeItem(TOKEN_KEY)
    }
}


export default new InternalStorage()
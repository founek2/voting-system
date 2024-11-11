import { EventEmitter } from "events"

const storage = localStorage
const TOKEN_KEY = 'accessToken'
const URL_KEY = 'originalUrl'

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

    public setOriginalUrl(pathname: string) {
        storage.setItem(URL_KEY, pathname)
    }

    public getOriginalUrl(): string | null {
        return storage.getItem(URL_KEY)
    }

    public deleteOriginalUrl() {
        storage.removeItem(URL_KEY)
    }

    public popOriginalUrl(): string | null {
        const url = storage.getItem(URL_KEY)
        this.deleteOriginalUrl();

        return url
    }
}


export default new InternalStorage()
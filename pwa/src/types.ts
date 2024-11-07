import { Election_jsonld, User_jsonld_user_read } from "./endpoints/types";

export type User = User_jsonld_user_read

function createEnumObject<T extends string>(o: { [P in T]: P }) {
    return o;
}

export const Role = createEnumObject<Exclude<User['roles'], undefined>>({
    chairman: "chairman",
    member: "member",
    voter: "voter"
})

export type Election = Election_jsonld
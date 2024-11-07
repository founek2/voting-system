import { Election_jsonld_election_read, User_jsonld_user_read, Position_jsonld_position_read } from "./endpoints/types";

export type User = User_jsonld_user_read

function createEnumObject<T extends string>(o: { [P in T]: P }) {
    return o;
}

export const Role = createEnumObject<Exclude<User['roles'], undefined>>({
    chairman: "chairman",
    member: "member",
    voter: "voter"
})

export type Election = Election_jsonld_election_read
export type Position = Position_jsonld_position_read
export type Hydra<T> = {
    member: T[],
    totalItems: number
}
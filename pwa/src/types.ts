import { Election_jsonld_election_read_media_read_url, User_jsonld_user_read, Position_jsonld_position_read, Candidate_jsonld_candidate_read, } from "./endpoints/types";

export type User = User_jsonld_user_read

function createEnumObject<T extends string>(o: { [P in T]: P }) {
    return o;
}

export const Role = createEnumObject<Exclude<User['roles'], undefined>>({
    ROLE_ADMIN: "ROLE_ADMIN",
    member: "member",
    voter: "voter"
})

export type Candidate = Candidate_jsonld_candidate_read
export type Election = Election_jsonld_election_read_media_read_url
export type Position = Position_jsonld_position_read
export type Hydra<T> = {
    member: T[],
    totalItems: number
}
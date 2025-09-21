/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HydraItemBaseSchema } from './HydraItemBaseSchema';
import type { MediaPoster_jsonld_candidate_read } from './MediaPoster_jsonld_candidate_read';
import type { Position_jsonld_candidate_read } from './Position_jsonld_candidate_read';
import type { User_jsonld_candidate_read } from './User_jsonld_candidate_read';
export type Candidate_jsonld_candidate_read = (HydraItemBaseSchema & {
    readonly id?: number;
    election: string;
    appUser?: User_jsonld_candidate_read;
    position: Position_jsonld_candidate_read;
    poster?: (MediaPoster_jsonld_candidate_read | null);
    withdrewAt?: string | null;
    rejectedAt?: string | null;
    winnerMarkedAt?: string | null;
    readonly withdrawAllowed?: boolean;
});


import { Hydra } from '../types';
import { api } from './api';
import { Position_jsonld_position_read, Position_position_write, Zone_jsonld_zone_read } from './types';

export const zoneApi = api.injectEndpoints({
    endpoints: (build) => ({
        getZones: build.query<Hydra<Zone_jsonld_zone_read>, void>({
            query: () => `zones`,
            providesTags: ['Zones'],
        }),
        getZone: build.query<Zone_jsonld_zone_read, number>({
            query: (id) => `zones/${id}`,
            providesTags: ['Zones'],
        }),
    }),
});

export const { useGetZonesQuery } = zoneApi;
<?php

declare(strict_types=1);

namespace App\Dto;

class RoleDto
{
    public function __construct(
        /** extended_member | payments_admin | tags_admin | roles_admin | registrator | admin | netadmin | student_representative | board_member | service_admin | dns_admin | mail_admin | card_readers_admin | cameras_admin | wifi_admin | secretary | financial_manager | finance_user | superuser */
        public string $role,
        public string $name,
        public string $description,
        /** unlimited | zones | services | domains | budget_chapters */
        public string $limit,
    ) {}
}

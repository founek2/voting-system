<?php

namespace App\Doctrine\Types;

use App\Dto\AccessTokenDto;
use Doctrine\DBAL\Types\Type;
use Doctrine\DBAL\Platforms\AbstractPlatform;

class AccessTokenType extends Type
{
    const MYTYPE = 'accessToken'; // modify to match your type name

    public function getSQLDeclaration(array $fieldDeclaration, AbstractPlatform $platform): string
    {
        return 'JSONB';
    }

    public function convertToPHPValue($value, AbstractPlatform $platform): mixed
    {
        // This is executed when the value is read from the database. Make your conversions here, optionally using the $platform.
        // var_dump($value);
        if ($value == null || empty($value)) return null;

        $json = json_decode($value, true);
        return new AccessTokenDto($json);
    }

    public function convertToDatabaseValue($value, AbstractPlatform $platform): mixed
    {
        // This is executed when the value is written to the database. Make your conversions here, optionally using the $platform.
        return json_encode($value->jsonSerialize());
    }

    public function getName()
    {
        return self::MYTYPE; // modify to match your constant name
    }
}

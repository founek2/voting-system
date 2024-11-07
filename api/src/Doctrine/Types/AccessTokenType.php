<?php

namespace App\Doctrine\Types;

use Doctrine\DBAL\Types\Type;
use Doctrine\DBAL\Platforms\AbstractPlatform;
use League\OAuth2\Client\Token\AccessToken;

/**
 * My custom datatype.
 */
class AccessTokenType extends Type
{
    const MYTYPE = 'accessToken'; // modify to match your type name

    public function getSQLDeclaration(array $fieldDeclaration, AbstractPlatform $platform)
    {
        // return the SQL used to create your column type. To create a portable column type, use the $platform.
        return 'JSONB';
    }

    public function convertToPHPValue($value, AbstractPlatform $platform)
    {
        // This is executed when the value is read from the database. Make your conversions here, optionally using the $platform.
        // var_dump($value);
        $json = json_decode($value ?? "{}", true);
        return new AccessToken($json);
    }

    public function convertToDatabaseValue($value, AbstractPlatform $platform)
    {
        // This is executed when the value is written to the database. Make your conversions here, optionally using the $platform.
        return json_encode($value->jsonSerialize());
    }

    public function getName()
    {
        return self::MYTYPE; // modify to match your constant name
    }
}

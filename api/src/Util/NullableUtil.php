<?php

namespace App\Util;

use InvalidArgumentException;

class NullableUtil
{
    /**
     * @template T
     *
     * @param null|T $value
     *
     * @return T
     */
    public static function notNullOrThrow(mixed $value, ?string $message = null): mixed
    {
        if ($value === null) {
            throw new InvalidArgumentException($message ?? 'Value cannot be null');
        }

        return $value;
    }
}

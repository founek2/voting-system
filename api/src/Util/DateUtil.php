<?php

namespace App\Util;

use DateTime;
use DateTimeInterface;

class DateUtil
{
    public static function setTimezone(DateTime|DateTimeInterface $date): DateTime
    {
        if ($date instanceof DateTimeInterface && !($date instanceof DateTime)) {
            $date = DateTime::createFromInterface($date);
        }
        $date->setTimezone(new \DateTimeZone('Europe/Prague'));
        return $date;
    }
}

<?php

declare(strict_types=1);

namespace App\Tests\Entity;

use App\Entity\User;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    #[DataProvider('doorNumbers')]
    public function testLivesAtStrahov(?string $doorNumber, bool $expected): void
    {
        $user = (new User())->setDoorNumber($doorNumber);

        self::assertSame($expected, $user->livesAtStrahov());
    }

    public static function doorNumbers(): iterable
    {
        yield 'Blok 2/12' => ['12', true];
        yield 'Blok 2/338' => ['338', true];
        yield 'Blok 2/s119' => ['s119', true];
        yield 'Blok 8/308B' => ['308B', true];
        yield 'Blok 8/008' => ['008', true];
        yield 'Blok 8/010A' => ['010A', true];
        yield 'Blok 8/612B' => ['612B', true];
        yield 'Blok 2/0chodba' => ['0chodba', false];
        yield 'Blok 2/2' => ['2', false];
        yield 'Blok 2/Fitko' => ['Fitko', false];
        yield 'Blok 2/Privat' => ['Privat', false];
        yield 'two non-consecutive digits' => ['1a2', false];
        yield 'empty room designation' => ['', false];
        yield 'missing room designation' => [null, false];
    }
}

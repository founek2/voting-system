<?php

namespace App\Exception;

use ApiPlatform\Validator\Exception\ValidationException;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\ConstraintViolationList;

class ValidationError
{
    /**
     * @param array<string,mixed> $parameters
     */
    public static function newConstraintViolation(
        string $message,
        string $messageTemplate = '',
        array $parameters = [],
        mixed $root = '',
        string $propertyPath = '',
        mixed $invalidValue = '',
        ?int $plural = null,
        ?string $code = null,
        ?Constraint $constraint = null,
        mixed $cause = null
    ): ValidationException {
        return new ValidationException(
            new ConstraintViolationList(
                [new ConstraintViolation($message, $messageTemplate, $parameters, $root, $propertyPath, $invalidValue, $plural, $code, $constraint, $cause)]
            )
        );
    }
}

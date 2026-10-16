<?php

declare(strict_types=1);

namespace App\Tests\Integration;

use ApiPlatform\Metadata\Property\Factory\PropertyMetadataFactoryInterface;
use App\Dto\ServiceDto;
use App\Entity\MediaResolution;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactoryInterface;

class SymfonyCompatibilityTest extends KernelTestCase
{
    public function testApiPlatformUsesNativePropertyTypes(): void
    {
        $factory = self::getContainer()->get(PropertyMetadataFactoryInterface::class);

        self::assertNotNull($factory->create(User::class, 'firstName')->getNativeType());
        self::assertNotNull($factory->create(MediaResolution::class, 'file')->getNativeType());
    }

    public function testSerializerAttributesPreserveMetadata(): void
    {
        $factory = self::getContainer()->get(ClassMetadataFactoryInterface::class);
        $userAttributes = $factory->getMetadataFor(User::class)->getAttributesMetadata();
        $serviceAttributes = $factory->getMetadataFor(ServiceDto::class)->getAttributesMetadata();

        self::assertContains('user:read', $userAttributes['firstName']->getGroups());
        self::assertSame('servicetype', $serviceAttributes['serviceType']->getSerializedName());
    }
}

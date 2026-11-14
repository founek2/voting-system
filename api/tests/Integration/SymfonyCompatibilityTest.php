<?php

declare(strict_types=1);

namespace App\Tests\Integration;

use ApiPlatform\Metadata\Property\Factory\PropertyMetadataFactoryInterface;
use App\Dto\ServiceDto;
use App\Entity\MediaResolution;
use App\Entity\User;
use App\Message\ElectionNotification;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Messenger\Envelope;
use Symfony\Component\Messenger\Transport\Serialization\SerializerInterface;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactoryInterface;

class SymfonyCompatibilityTest extends KernelTestCase
{
    public function testElectionNotificationMessengerSerialization(): void
    {
        $serializer = self::getContainer()->get('messenger.transport.symfony_serializer');
        self::assertInstanceOf(SerializerInterface::class, $serializer);

        $encoded = $serializer->encode(new Envelope(new ElectionNotification(5, 'voter@example.org')));
        self::assertSame(5, json_decode($encoded['body'], true, flags: JSON_THROW_ON_ERROR)['electionId']);

        $message = $serializer->decode($encoded)->getMessage();
        self::assertInstanceOf(ElectionNotification::class, $message);
        self::assertSame(5, $message->getElectionId());
        self::assertSame('voter@example.org', $message->getEmail());
    }

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

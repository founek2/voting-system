<?php

declare(strict_types=1);

namespace App\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\OpenApi\Model\Parameter;
use ApiPlatform\OpenApi\Model\PathItem;
use ApiPlatform\OpenApi\Model\RequestBody;
use ApiPlatform\OpenApi\OpenApi as OpenApiAlias;
use ArrayObject;
use Symfony\Component\HttpFoundation\Response;

final class OpenApiFactory implements OpenApiFactoryInterface
{

    public function __construct(private readonly OpenApiFactoryInterface $decorated) {}

    public function __invoke(array $context = []): OpenApiAlias
    {
        $openApi = ($this->decorated)($context);
        $schemas = $openApi->getComponents()->getSchemas();

        if (!$schemas) {
            throw new \RuntimeException('Schemas are not initialized');
        }

        // $schemas['Token'] = new ArrayObject([
        //     'type' => 'object',
        //     'properties' => [
        //         'token' => [
        //             'type' => 'string',
        //             'readOnly' => true,
        //         ]
        //     ],
        // ]);


        $this->getVerifyEmail($schemas, $openApi);

        return $openApi;
    }

    private function getVerifyEmail(ArrayObject|array $schemas, OpenApiAlias $openApi): void
    {
        $schemas['Credentials'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'code' => [
                    'type' => 'string',
                    'example' => '31d893c6548a28f6598dff089dd6158f9df01bf2720bc22a0d01ee74f3894ec8',
                ],
            ],
        ]);

        // $openApi
        //     ->getPaths()
        //     ->addPath('/api/login', new PathItem(
        //         null,
        //         null,
        //         null,
        //         new Operation(
        //             'post',
        //             ['Login user'],
        //             [
        //                 Response::HTTP_OK => [],
        //             ],
        //             'Used for verification of a user registration by email+password combination',
        //             'In OpenApi just for documentation purposes, clicked from email.',
        //             null,
        //             requestBody: new RequestBody(
        //                 description: 'Generate new JWT Token',
        //                 content: new \ArrayObject([
        //                     'application/json' => [
        //                         'schema' => [
        //                             '$ref' => '#/components/schemas/Credentials',
        //                         ],
        //                     ],
        //                 ]),
        //             ),

        //         )
        //     ));
    }
}

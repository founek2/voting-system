<?php

namespace App\Tests\Service;

use App\Services\IsApiService;
use App\Tests\Fixtures\ApiTestCaseClient;

class IsApiServiceTest extends ApiTestCaseClient
{
    public function testDataSerialize(): void
    {
        $data = '[{"uid":1,"email":"j.xx@sh.cvut.cz","zone":"Blok 7"},{"uid":2,"email":"a.yy@sh.cvut.cz","zone":"Blok 5"},{"uid":1025,"email":"o.zz@sh.cvut.cz","zone":"Blok 7"}]';

        /** @var IsApiService */
        $apiService = $this->getContainer()->get(IsApiService::class);

        $users =  $apiService->parseData($data);
        self::assertCount(3, $users);
        self::assertEquals('j.xx@sh.cvut.cz', $users[0]->email);
        self::assertEquals('a.yy@sh.cvut.cz', $users[1]->email);
        self::assertEquals('o.zz@sh.cvut.cz', $users[2]->email);
    }
}

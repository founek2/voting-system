<?php

namespace App\Repository;

use App\Entity\Zone;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Zone>
 */
class ZoneRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Zone::class);
    }

    //    /**
    //     * @return Zone[] Returns an array of Zone objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('z')
    //            ->andWhere('z.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('z.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    public function upsert(int $id, string $name, string $alias, string $note): ?Zone
    {
        $em = $this->getEntityManager();

        /** @var Zone|null */
        $zone = $this->find($id);
        if ($zone) {
            $this->update($zone, $id,  $name,  $alias, $note);
        } else {
            $zone = new Zone();
            $this->update($zone, $id,  $name,  $alias, $note);
            $em->persist($zone);
        }

        $em->flush();

        return $zone;
    }

    private function update(Zone $zone, int $id, string $name, string $alias, string $note)
    {
        $zone
            ->setId($id)
            ->setName($name)
            ->setAlias($alias)
            ->setNote($note);
    }
}

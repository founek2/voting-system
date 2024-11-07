<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241026190036 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE "user" ADD zone_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD access_token JSON NOT NULL');
        $this->addSql('ALTER TABLE "user" ADD door_number VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD roles JSON NOT NULL');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D6499F2C3FAB FOREIGN KEY (zone_id) REFERENCES zone (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_8D93D6499F2C3FAB ON "user" (zone_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D6499F2C3FAB');
        $this->addSql('DROP INDEX IDX_8D93D6499F2C3FAB');
        $this->addSql('ALTER TABLE "user" DROP zone_id');
        $this->addSql('ALTER TABLE "user" DROP access_token');
        $this->addSql('ALTER TABLE "user" DROP door_number');
        $this->addSql('ALTER TABLE "user" DROP roles');
    }
}

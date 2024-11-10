<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241109115742 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE candidate ADD poster_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE candidate ADD CONSTRAINT FK_C8B28E445BB66C05 FOREIGN KEY (poster_id) REFERENCES media_poster (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C8B28E445BB66C05 ON candidate (poster_id)');
        $this->addSql('ALTER TABLE "user" ALTER access_token TYPE JSONB');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE candidate DROP CONSTRAINT FK_C8B28E445BB66C05');
        $this->addSql('DROP INDEX UNIQ_C8B28E445BB66C05');
        $this->addSql('ALTER TABLE candidate DROP poster_id');
        $this->addSql('ALTER TABLE "user" ALTER access_token TYPE JSONB');
    }
}

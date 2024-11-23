<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241123174056 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX single_candidate_idx');
        $this->addSql('CREATE UNIQUE INDEX single_candidate_idx ON candidate (election_id, app_user_id, withdrew_at)');
        $this->addSql('ALTER TABLE "user" ALTER access_token TYPE JSONB');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP INDEX single_candidate_idx');
        $this->addSql('CREATE UNIQUE INDEX single_candidate_idx ON candidate (election_id, app_user_id)');
        $this->addSql('ALTER TABLE "user" ALTER access_token TYPE JSONB');
    }
}

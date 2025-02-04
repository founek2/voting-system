<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250204213636 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE media_report ADD election_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE media_report ADD CONSTRAINT FK_7856ED5AA708DAFF FOREIGN KEY (election_id) REFERENCES election (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_7856ED5AA708DAFF ON media_report (election_id)');
        $this->addSql('ALTER TABLE media_resolution ADD election_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE media_resolution ADD CONSTRAINT FK_F7F6C11EA708DAFF FOREIGN KEY (election_id) REFERENCES election (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_F7F6C11EA708DAFF ON media_resolution (election_id)');
        $this->addSql('ALTER TABLE "user" ALTER access_token TYPE JSONB');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE media_report DROP CONSTRAINT FK_7856ED5AA708DAFF');
        $this->addSql('DROP INDEX IDX_7856ED5AA708DAFF');
        $this->addSql('ALTER TABLE media_report DROP election_id');
        $this->addSql('ALTER TABLE media_resolution DROP CONSTRAINT FK_F7F6C11EA708DAFF');
        $this->addSql('DROP INDEX IDX_F7F6C11EA708DAFF');
        $this->addSql('ALTER TABLE media_resolution DROP election_id');
        $this->addSql('ALTER TABLE "user" ALTER access_token TYPE JSONB');
    }
}

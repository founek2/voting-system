<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250314170436 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE ballot_result_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE ballot_result (id INT NOT NULL, candidate_id INT NOT NULL, positive_votes INT NOT NULL, negative_votes INT NOT NULL, neutral_votes INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_9FCCC10091BD8781 ON ballot_result (candidate_id)');
        $this->addSql('ALTER TABLE ballot_result ADD CONSTRAINT FK_9FCCC10091BD8781 FOREIGN KEY (candidate_id) REFERENCES candidate (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE candidate ADD winner_marked_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN candidate.winner_marked_at IS \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE ballot_result_id_seq CASCADE');
        $this->addSql('ALTER TABLE ballot_result DROP CONSTRAINT FK_9FCCC10091BD8781');
        $this->addSql('DROP TABLE ballot_result');
        $this->addSql('ALTER TABLE candidate DROP winner_marked_at');
    }
}

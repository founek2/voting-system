<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241026193427 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE candidate_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE election_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE vote_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE candidate (id INT NOT NULL, election_id INT NOT NULL, app_user_id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_C8B28E44A708DAFF ON candidate (election_id)');
        $this->addSql('CREATE INDEX IDX_C8B28E444A3353D8 ON candidate (app_user_id)');
        $this->addSql('CREATE TABLE election (id INT NOT NULL, announcement_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, registration_of_candidates_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, campaign_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, electronic_voting_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, ballot_voting_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, preliminary_results_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, complaints_deadline_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, final_results_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE vote (id INT NOT NULL, candidate_id INT NOT NULL, app_user_id INT NOT NULL, value INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_5A10856491BD8781 ON vote (candidate_id)');
        $this->addSql('CREATE INDEX IDX_5A1085644A3353D8 ON vote (app_user_id)');
        $this->addSql('CREATE UNIQUE INDEX uniq_vote_idx ON vote (candidate_id, app_user_id)');
        $this->addSql('ALTER TABLE candidate ADD CONSTRAINT FK_C8B28E44A708DAFF FOREIGN KEY (election_id) REFERENCES election (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE candidate ADD CONSTRAINT FK_C8B28E444A3353D8 FOREIGN KEY (app_user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE vote ADD CONSTRAINT FK_5A10856491BD8781 FOREIGN KEY (candidate_id) REFERENCES candidate (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE vote ADD CONSTRAINT FK_5A1085644A3353D8 FOREIGN KEY (app_user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE candidate_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE election_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE vote_id_seq CASCADE');
        $this->addSql('ALTER TABLE candidate DROP CONSTRAINT FK_C8B28E44A708DAFF');
        $this->addSql('ALTER TABLE candidate DROP CONSTRAINT FK_C8B28E444A3353D8');
        $this->addSql('ALTER TABLE vote DROP CONSTRAINT FK_5A10856491BD8781');
        $this->addSql('ALTER TABLE vote DROP CONSTRAINT FK_5A1085644A3353D8');
        $this->addSql('DROP TABLE candidate');
        $this->addSql('DROP TABLE election');
        $this->addSql('DROP TABLE vote');
    }
}

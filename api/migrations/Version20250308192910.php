<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250308192910 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE board_member_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE board_member (id INT NOT NULL, app_user_id INT NOT NULL, position_id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_DCFABEDF4A3353D8 ON board_member (app_user_id)');
        $this->addSql('CREATE INDEX IDX_DCFABEDFDD842E46 ON board_member (position_id)');
        $this->addSql('ALTER TABLE board_member ADD CONSTRAINT FK_DCFABEDF4A3353D8 FOREIGN KEY (app_user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE board_member ADD CONSTRAINT FK_DCFABEDFDD842E46 FOREIGN KEY (position_id) REFERENCES position (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "user" ALTER access_token TYPE JSONB');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE board_member_id_seq CASCADE');
        $this->addSql('ALTER TABLE board_member DROP CONSTRAINT FK_DCFABEDF4A3353D8');
        $this->addSql('ALTER TABLE board_member DROP CONSTRAINT FK_DCFABEDFDD842E46');
        $this->addSql('DROP TABLE board_member');
        $this->addSql('ALTER TABLE "user" ALTER access_token TYPE JSONB');
    }
}

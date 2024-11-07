<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241107191156 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE position_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE election_position (election_id INT NOT NULL, position_id INT NOT NULL, PRIMARY KEY(election_id, position_id))');
        $this->addSql('CREATE INDEX IDX_1C93E667A708DAFF ON election_position (election_id)');
        $this->addSql('CREATE INDEX IDX_1C93E667DD842E46 ON election_position (position_id)');
        $this->addSql('CREATE TABLE position (id INT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE position_zone (position_id INT NOT NULL, zone_id INT NOT NULL, PRIMARY KEY(position_id, zone_id))');
        $this->addSql('CREATE INDEX IDX_B373EE59DD842E46 ON position_zone (position_id)');
        $this->addSql('CREATE INDEX IDX_B373EE599F2C3FAB ON position_zone (zone_id)');
        $this->addSql('ALTER TABLE election_position ADD CONSTRAINT FK_1C93E667A708DAFF FOREIGN KEY (election_id) REFERENCES election (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE election_position ADD CONSTRAINT FK_1C93E667DD842E46 FOREIGN KEY (position_id) REFERENCES position (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE position_zone ADD CONSTRAINT FK_B373EE59DD842E46 FOREIGN KEY (position_id) REFERENCES position (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE position_zone ADD CONSTRAINT FK_B373EE599F2C3FAB FOREIGN KEY (zone_id) REFERENCES zone (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE candidate ADD position_id INT NOT NULL');
        $this->addSql('ALTER TABLE candidate ADD CONSTRAINT FK_C8B28E44DD842E46 FOREIGN KEY (position_id) REFERENCES position (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_C8B28E44DD842E46 ON candidate (position_id)');
        $this->addSql('ALTER TABLE "user" ALTER access_token TYPE JSONB');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE candidate DROP CONSTRAINT FK_C8B28E44DD842E46');
        $this->addSql('DROP SEQUENCE position_id_seq CASCADE');
        $this->addSql('ALTER TABLE election_position DROP CONSTRAINT FK_1C93E667A708DAFF');
        $this->addSql('ALTER TABLE election_position DROP CONSTRAINT FK_1C93E667DD842E46');
        $this->addSql('ALTER TABLE position_zone DROP CONSTRAINT FK_B373EE59DD842E46');
        $this->addSql('ALTER TABLE position_zone DROP CONSTRAINT FK_B373EE599F2C3FAB');
        $this->addSql('DROP TABLE election_position');
        $this->addSql('DROP TABLE position');
        $this->addSql('DROP TABLE position_zone');
        $this->addSql('DROP INDEX IDX_C8B28E44DD842E46');
        $this->addSql('ALTER TABLE candidate DROP position_id');
        $this->addSql('ALTER TABLE "user" ALTER access_token TYPE JSONB');
    }
}

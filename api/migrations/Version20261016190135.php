<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261016190135 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE election ADD ballot_voting_description VARCHAR(500) NOT NULL');
        $this->addSql('DROP INDEX idx_550df1a216ba31db');
        $this->addSql('DROP INDEX idx_550df1a2e3bd61ce');
        $this->addSql('DROP INDEX idx_550df1a2fb7336f0');
        $this->addSql('CREATE INDEX IDX_550DF1A2FB7336F0E3BD61CE16BA31DBBF396750 ON async_messages (queue_name, available_at, delivered_at, id)');
        $this->addSql('DROP INDEX idx_6d01772efb7336f0');
        $this->addSql('DROP INDEX idx_6d01772ee3bd61ce');
        $this->addSql('DROP INDEX idx_6d01772e16ba31db');
        $this->addSql('CREATE INDEX IDX_6D01772EFB7336F0E3BD61CE16BA31DBBF396750 ON async_messages_failed (queue_name, available_at, delivered_at, id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX IDX_550DF1A2FB7336F0E3BD61CE16BA31DBBF396750');
        $this->addSql('CREATE INDEX idx_550df1a216ba31db ON async_messages (delivered_at)');
        $this->addSql('CREATE INDEX idx_550df1a2e3bd61ce ON async_messages (available_at)');
        $this->addSql('CREATE INDEX idx_550df1a2fb7336f0 ON async_messages (queue_name)');
        $this->addSql('DROP INDEX IDX_6D01772EFB7336F0E3BD61CE16BA31DBBF396750');
        $this->addSql('CREATE INDEX idx_6d01772efb7336f0 ON async_messages_failed (queue_name)');
        $this->addSql('CREATE INDEX idx_6d01772ee3bd61ce ON async_messages_failed (available_at)');
        $this->addSql('CREATE INDEX idx_6d01772e16ba31db ON async_messages_failed (delivered_at)');
        $this->addSql('ALTER TABLE election DROP ballot_voting_description');
    }
}
